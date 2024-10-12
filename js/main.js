
//DATA
const budget = []


// DOM
const form = document.querySelector('#form')

const type = document.querySelector('#type')
const title = document.querySelector('#title')
const value = document.querySelector('#value')

const incomesList = document.querySelector('#incomes-list')
const expensesList = document.querySelector('#expenses-list')

const budgetEl = document.querySelector('#budget')
const totalIncomeEl = document.querySelector('#total-income')
const totalExpenseEl = document.querySelector('#total-expense')
const percentsWrapper = document.querySelector('#expense-percents-wrapper')

const monthEl = document.querySelector('#month')
const yearEl = document.querySelector('#year')

// Functions

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
})

function insertTestData() {

    const testData = [
        { type: 'exp', title: 'Интернет', value: 300 },
        { type: 'exp', title: 'Квартира', value: 1000 },
        { type: 'exp', title: 'Коммуналка', value: 500 },

        { type: 'inc', title: 'Зарплата', value: 500 },
        { type: 'inc', title: 'Jet Land', value: 5000 },
        { type: 'inc', title: 'Фриланс', value: 500 },
    ]

    function getRandomIt(max) {
        return Math.floor(Math.random() * max)
    }

    const randomIndex = getRandomIt(testData.length)
    const randomData = testData[randomIndex]

    type.value = randomData.type
    title.value = randomData.title
    value.value = randomData.value

}

function claerForm() {
    form.reset()
}

function calcBudget() {

    const totalIncome = budget.reduce(function (total, element) {

        if (element.type === 'inc') {
            return total + element.value
        } else {
            return total
        }
    }, 0)

    const totalExpense = budget.reduce(function (total, element) {

        if (element.type === 'exp') {
            return total + element.value
        } else {
            return total
        }
    }, 0)

    const totalBudget = totalIncome - totalExpense

    let expensePercents = 0

    if (totalIncome) {
        expensePercents = Math.round((totalExpense * 100) / totalIncome)
    }

    budgetEl.innerHTML = priceFormatter.format(totalBudget)
    totalIncomeEl.innerHTML = '+ ' + priceFormatter.format(totalIncome)
    totalExpenseEl.innerHTML = '- ' + priceFormatter.format(totalExpense)

    if (expensePercents) {
        const html = `<div class="badge">${expensePercents}%</div>`
        percentsWrapper.innerHTML = html
    } else {
        percentsWrapper.innerHTML = ''
    }

}

function displayMonth() {
    const now = new Date()
    const year = now.getFullYear()

    const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
        month: 'long'
    })

    const month = timeFormatter.format(now)

    monthEl.innerHTML = month
    yearEl.innerHTML = year
}

displayMonth()
insertTestData()
calcBudget()

//Actions Add record
form.addEventListener('submit', function (event) {

    event.preventDefault()

    if (title.value.trim() === '') {
        title.classList.add('form__inpur--error')
        return
    } else {
        title.classList.remove('form__inpur--error')
    }

    if (value.value.trim() === '' || +value.value <= 0) {
        value.classList.add('form__inpur--error')
        return
    } else {
        value.classList.remove('form__inpur--error')
    }

    let id = 1

    if (budget.length > 0) {

        id = budget[budget.length - 1].id + 1

    }

    const record = {
        id: id,
        type: type.value,
        title: title.value.trim(),
        value: +value.value
    }

    budget.push(record)

    if (record.type === 'inc') {
        const html = `<li data-id = "${record.id}" class="budget-list__item item item--income">
                        <div class="item__title">${record.title}</div>
                            <div class="item__right">
                            <div class="item__amount">+ ${priceFormatter.format(record.value)}</div>
                            <button class="item__remove">
                                <img
                                        src="./img/circle-green.svg"
                                        alt="delete"
                                    />
                            </button>
                        </div>
                      </li>`

        incomesList.insertAdjacentHTML('afterbegin', html)
    } else if (record.type === 'exp') {
        const html = `<li data-id="${record.id}" class="budget-list__item item item--income">
                        <div class="item__title">${record.title}</div>
                        <div class="item__right">
                            <div class="item__amount">- ${priceFormatter.format(record.value)}</div>
                            <button class="item__remove">
                                <img
                                    src="./img/circle-green.svg"
                                    alt="delete"
                                />
                            </button>
                        </div>
                    </li>`

        expensesList.insertAdjacentHTML('afterbegin', html)
    }

    calcBudget()

    claerForm()
    insertTestData()
})

//Actions Remove record

document.body.addEventListener('click', function (event) {

    if (event.target.closest('button.item__remove')) {

        const recordElement = event.target.closest('li.budget-list__item')
        const id = +recordElement.dataset.id

        const index = budget.findIndex(function (item) {
            if (item.id === id) {
                return true
            }
        })

        budget.splice(index, 1)
        recordElement.remove()
        calcBudget()
    }

})