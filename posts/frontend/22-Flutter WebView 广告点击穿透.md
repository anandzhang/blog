---
typora-root-url: ../
tags: flutter, iOS
createTime: 2022-07-21
updateTime: 2022-07-21
keywords: flutter,flutter webview,flutter webview touch penetration,穿山甲广告点击穿透,flutter点击穿透
summary: 解决 Flutter WebView 点击穿透的问题，穿山甲广告使用 WebView 引起信息流广告被遮盖时仍能响应触摸事件，控制点击区域来解决来临时解决这个问题。
---

# Flutter WebView 广告点击穿透（上）

## 前言

最近和前端leader一起对穿山甲 GroMore 广告 SDK 做了封装，让它能更符合公司 Flutter 项目的需求，插件 [flutter_gromore](https://github.com/50431040/flutter_gromore)。穿山甲 GroMore 能让我们接入多家广告网络，可以根据竞价进行流量分配以增加广告收入，还是挺不错的，我们自己使用了穿山甲、优量汇、广点通的广告，但是穿山甲广告使用 `WebView` 实现，它在 iOS 上存在点击穿透的问题。

最开始我并不知道是 `WebView` 出现的点击穿透，后面发现优量汇、广点通的广告没有这个问题才发现是穿山甲使用了 `WebView` 的原因。然后我查看 Flutter 的一些 Issue ，发现一些有关这个问题的讨论：[flutter#58659](https://github.com/flutter/flutter/issues/58659) 、 [flutter#91681](https://github.com/flutter/flutter/issues/91681) 等，另外也发现 Flutter PlatformView 的一些性能问题：[flutter#107486](https://github.com/flutter/flutter/issues/107486) 、[flutter#103014](https://github.com/flutter/flutter/issues/103014) 、[flutter#101776](https://github.com/flutter/flutter/issues/101776) ，信息流广告有卡顿掉帧问题，在这个 [googleads-mobile-flutter](https://github.com/googleads/googleads-mobile-flutter/issues/580) 中我发现谷歌广告可能也用了 `WebView` ，后面有时间可以看看它有么有穿透问题。

![flutter-touch-penetration2](/images/frontend/22/flutter-touch-penetration2.gif)

![flutter-touch-penetration1](/images/frontend/22/flutter-touch-penetration1.gif)


针对 `WebView` 广告在 `Flutter` 上点击穿透，我想到一个方法来弥补这个问题，治标，能暂时解决问题。

## 限制可点击区域

我也尝试了一些方法来拦截 `WebView` 的触摸响应，可能我思想有点局限不知道怎么分辨哪些情况下的触摸是穿透的。我只想知道什么情况是真正点击到广告视图的，所以想得到广告视图渲染后的可见区域，尝试看了看 iOS 有没有提供什么方法，感觉有点麻烦，然后发现谷歌的一个插件 `visibility_detector` 能完成这个需求。

### Flutter 渲染后可见界限

使用 `visibility_detector` 插件探测信息流广告的可见区域， `visibility_detector` 插件提供的 `onVisibilityChanged` 回调方法中 `VisibilityInfo` 提供了 `visibleFraction` 可见部分 0~1 、`visibleBounds` 可见界限，然后把信息流广告的 `UiKitView` 包在里面。

```dart
class GromoreFeedView extends StatefulWidget {
  final Map<String, String> creationParams;
  final GromoreFeedCallback callback;

  const GromoreFeedView({
    Key? key,
    required this.creationParams,
    required this.callback,
  }) : super(key: key);

  @override
  State<GromoreFeedView> createState() => _GromoreFeedViewState();
}

class _GromoreFeedViewState extends State<GromoreFeedView> {
  final UniqueKey _detectorKey = UniqueKey();

  @override
  Widget build(BuildContext context) {
    String viewType = FlutterGromoreConstants.feedViewTypeId;

    return Platform.isAndroid
        // 安卓端代码省略
        ? const SizedBox.shrink()
        : VisibilityDetector(
            key: _detectorKey,
            child: UiKitView(
                viewType: viewType,
                creationParams: widget.creationParams,
                creationParamsCodec: const StandardMessageCodec(),
                onPlatformViewCreated: (id) {
                  // 注册事件回调
                  GromoreMethodChannelHandler<GromoreFeedCallback>.register(
                      '$viewType/$id', widget.callback);
                }),
            onVisibilityChanged: (VisibilityInfo visibilityInfo) {
              // 可见分数、界限
              print(visibilityInfo.visibleFraction);
              print(visibilityInfo.visibleBounds);
            },
          );
  }
}
```

这样就能拿到广告真正显示的区域了，`visibleBounds` 是一个 `Rect` 类型，我们可以拿到 `top` 、`left` 、`width` 、`height` 数据～，然后传给 iOS 端来根据它们拦截触摸事件。

### iOS 根据可见区域拦截触摸

新增一个 `FlutterGromoreIntercptPenetrateView` 视图来代替信息流广告 `FlutterPlatformView` 返回的 `UIView` ，用它来拦截点击穿透，因为暂时只有穿山甲使用 `WebView` 有这个问题，所以加一个 `isPermeable` 属性，在 GroMore SDK 的回调中根据 `adnName` 判断广告类型，是穿山甲就赋为 `true` 。

```swift
/// 用于拦截点击穿透
class FlutterGromoreIntercptPenetrateView: UIView {
  /// 存在穿透问题？
  var isPermeable: Bool = false
  /// 广告是否被覆盖
  var isCovered: Bool = false
  /// 广告的可见区域
  var visibleBounds: CGRect = CGRect.zero
  
  init(frame: CGRect, methodChannel: FlutterMethodChannel) {
    super.init(frame: frame)
    methodChannel.setMethodCallHandler(handle(_:result:))
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
  }
  
  func handle(_ call: FlutterMethodCall, result: @escaping FlutterResult) {
    switch call.method {
    case "updateVisibleBounds":
      let args: [String: Any] = call.arguments as! [String: Any]
      isCovered = args["isCovered"] as! Bool
      visibleBounds = CGRect(x: args["x"] as! Double, y: args["y"] as! Double, width: args["width"] as! Double, height: args["height"] as! Double)
      result(true)
    default:
      result(FlutterMethodNotImplemented)
    }
  }
  
  override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
    if isPermeable {
      // 在窗口的点击位置
      let windowPoint: CGPoint = convert(point, to: Utils.getVC().view)
      // 被覆盖时 -> 点击位置不在可见区域
      if isCovered && !visibleBounds.contains(windowPoint) {
        return false
      }
    }
    return true
  }
}
```

有关使用这个拦截视图的地方可以看插件库 [FlutterGromoreFeed.swift](https://github.com/50431040/flutter_gromore/blob/43bd07fb1dea83e5a9e38714f01fd0dfaa5d4a61/ios/Classes/view/FlutterGromoreFeed.swift) ，之后有好方案会继续更新。

### Flutter 方法通道更新界限

我们在 `onVisibilityChanged` 时更新 iOS 端管理的可见区域数据：

```dart
// 省略部分代码
class _GromoreFeedViewState extends State<GromoreFeedView> {
  final UniqueKey _detectorKey = UniqueKey();
  MethodChannel? _methodChannel;

  @override
  void initState() {
    // 默认更新间隔是 500ms
    VisibilityDetectorController.instance.updateInterval =
        const Duration(milliseconds: 100);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    String viewType = FlutterGromoreConstants.feedViewTypeId;

    return Platform.isAndroid
        // 安卓端代码省略
        ? const SizedBox.shrink()
        : VisibilityDetector(
            key: _detectorKey,
            child: UiKitView(
                viewType: viewType,
                creationParams: widget.creationParams,
                creationParamsCodec: const StandardMessageCodec(),
                onPlatformViewCreated: (id) {
                  // 创建这个 PlatformView 的方法通道
                  final String channelName = "$viewType/$id";
                  _methodChannel = MethodChannel(channelName);
                  // 注册事件回调
                  GromoreMethodChannelHandler<GromoreFeedCallback>.register(
                      channelName, widget.callback);
                }),
            onVisibilityChanged: (VisibilityInfo visibilityInfo) {
              if (!mounted) return;
              // 被遮盖了
              final bool isCovered = visibilityInfo.visibleFraction != 1.0;
              final Offset offset = (context.findRenderObject() as RenderBox)
                  .localToGlobal(Offset.zero);
              _methodChannel?.invokeMethod('updateVisibleBounds', {
                'isCovered': isCovered,
                'x': offset.dx + visibilityInfo.visibleBounds.left,
                'y': offset.dy + visibilityInfo.visibleBounds.top,
                'width': visibilityInfo.visibleBounds.width,
                'height': visibilityInfo.visibleBounds.height,
              });
            },
          );
  }
}
```

`onVisibilityChanged` 间隔默认是 `500ms` ，我们可以通过`VisibilityDetectorController.instance.updateInterval` 修改，也可以通过 `notifyNow` 方法手动触发。

## 拦截触摸后效果

被 Flutter 的 `Widget` 覆盖时能正确控制可点击区域，不会再出现点击穿透问题。

![flutter-touch-penetration3](/images/frontend/22/flutter-touch-penetration3.gif)

但是由于 `visibility_detector` 插件对 `Overlay` 覆盖探测不了，所以在被 `Overlay` 这种部件覆盖时点击广告还是会出现点击穿透。

![flutter-touch-penetration4](/images/frontend/22/flutter-touch-penetration4.gif)

针对这个问题我根据 `FlutterPlatformView` 渲染后形成的 `FlutterOverlayView` 尝试解决，可见 [Flutter WebView 广告点击穿透（下）](https://anandzhang.com/posts/frontend/23) 。

