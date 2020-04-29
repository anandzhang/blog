var mobileBtn = document.querySelector('.mobile-btn')
var headerElem = document.querySelector('.header')
mobileBtn.onclick = function () {
  headerElem.classList.toggle('close')
}
