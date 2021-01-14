function hasScrollBar () {
  const visibleHeight = window.innerHeight || document.documentElement.clientHeight
  return document.body.scrollHeight > visibleHeight
}

function whetherToFixFooter () {
  if (hasScrollBar()) {
    footer.classList.remove('fixed-bottom')
  } else {
    footer.classList.add('fixed-bottom')
  }
}

const footer = document.getElementById('footer')
window.onload = whetherToFixFooter
window.onresize = whetherToFixFooter
