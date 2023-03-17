const form = document.querySelector('#new-comment-form')
const userName = form['user-name']
const date = form['comments-date']
const text = form['comments-text']
date.max = new Date().toISOString().split('T')[0]
date.min = '1970-01-01'

const nameValidation = (event) => {
  const target = event.target || event
  if (target.value.length === 0) {
    addError(target, 'Данное поле должно быть заполнено')
    return false
  }
  if (target.value.length > 60) {
    addError(target, 'Длинна текста не должна превышать 60 символов')
    return false
  }

  return true
}

const submitForm = (event) => {
  if (event.keyCode === 13) {
    event.preventDefault()
    form.submit.click()
  }
}

const textValidation = (event) => {
  const target = event.target || event
  if (target.value.length === 0) {
    addError(target, 'Данное поле должно быть заполнено')
    return false
  }
  if (target.value.length > 400) {
    addError(target, 'Длинна текста не должна превышать 400 символов')
    return false
  }
  // form.onkeydown = submitForm
  return true
}

const dateValidation = (target) => {
  const currentDate = new Date()
  let hours = currentDate.getHours()
  if (hours < 10) {
    hours = '0' + hours
  }

  let minutes = currentDate.getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  if (!target) {
    return `Сегодня, ${hours}:${minutes}`
  }
  const selectedDate = new Date(target)

  if (selectedDate.getDate() === currentDate.getDate() - 1) {
    return `Вчера, ${hours}:${minutes}`
  }

  let day = selectedDate.getDate()
  if (day < 10) {
    day = '0' + day
  }

  let month = selectedDate.getMonth()
  if (month < 10) {
    month = '0' + month
  }
  return `${day}.${month}.${selectedDate.getFullYear()}, ${hours}:${minutes}`
}

const addError = (target, errorText) => {
  const commentsWrapper = target.closest('.comments__wrapper')
  const commentError = commentsWrapper.querySelector('.form-error')
  if (commentError) return
  const error = document.createElement('span')
  error.className = 'form-error'
  error.innerHTML = errorText
  target.classList.add('input-error')
  commentsWrapper.append(error)
}

const removeError = (event) => {
  document.addEventListener('keydown', submitForm)
  const commentsWrapper = event.target.closest('.comments__wrapper')
  const formError = commentsWrapper.querySelector('.form-error')
  if (!formError) return

  event.target.classList.remove('input-error')
  formError.remove()
}

const addComment = (name, date, text) => {
  const commentsItems = document.querySelector('.comments__items')
  const commentHTML = `
  <div class='comments__block'>
      <div class='comments__item content-block'>
        <div class='comments_split-block'>
          <div class='comments__item_title'>
            <h3 class='comments__item_name'>${name}</h3>
            <span class='comments__item_time'>${date}</span>
          </div>
          <div class='comments__icons'>
            <img id='favourite' data-is-favourite='false' src='assets/add-favourite.svg' height='20' alt='favourite'>
            <img id='delete' src='assets/delete.svg' height='20' alt='delete'>
          </div>
        </div>
        <p class='comments__item_text'>${text}</p>
      </div>
    </div>
    `
  const commentsBlock = document.createElement('div')
  commentsBlock.className = 'comments__block'
  commentsBlock.innerHTML = commentHTML

  commentsItems.prepend(commentsBlock)
}

const clearForm = () => {
  userName.value = ''
  date.value = ''
  text.value = ''
}

const toggleSend = (event) => {
  event.preventDefault()
  const validateName = nameValidation(userName)
  const validateText = textValidation(text)

  if (validateName && validateText) {
    addComment(userName.value, dateValidation(date.value), text.value)
    clearForm()
  }
}

const toggleIconClick = (event) => {
  if (event.target.id === 'favourite') {
    if (event.target.dataset.isFavourite === 'false') {
      event.target.dataset.isFavourite = 'true'
      event.target.src = '/assets/remove-favourite.svg'
    } else if (event.target.dataset.isFavourite === 'true') {
      event.target.src = '/assets/add-favourite.svg'
      event.target.dataset.isFavourite = 'false'
    }
  }

  if (event.target.id === 'delete') {
    event.target.closest('.comments__block').remove()
  }
}

document.querySelector('.comments__items').addEventListener('click', toggleIconClick)

userName.addEventListener('blur', (event) => {
  document.removeEventListener('keydown', submitForm)
  nameValidation(event)
})
userName.addEventListener('focus', removeError)

text.addEventListener('blur', (event) => {
  document.removeEventListener('keydown', submitForm)
  textValidation(event)
})
text.addEventListener('focus', removeError)

form.onsubmit = toggleSend
