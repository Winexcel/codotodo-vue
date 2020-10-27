export const selectAll = {
  inserted(el) {
    const input = el.querySelector('.q-field__native');
    input.addEventListener('focus', () => {
      input.select();
    })
  }
}
