const mobileBtn = document.querySelector('.mobile-btn')
const headerElem = document.querySelector('.header')
mobileBtn.onclick = function () {
  headerElem.classList.toggle('close')
}
