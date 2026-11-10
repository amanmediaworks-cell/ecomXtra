;(() => {
  const accountCountInput = document.getElementById('accounts')
  const clientEmailInput = document.getElementById('email')
  const customMessageInput = document.getElementById('message')
  const resetButton = document.getElementById('reset')
  const originalRender = window.render.bind(window)
  const presets = [
    'Thank you for the opportunity to present this proposal. We look forward to supporting your marketplace growth.',
    'Based on our conversation, we have tailored this proposal to your business goals.',
    'We would be happy to discuss any part of this proposal and adjust the scope to your needs.',
  ]
  const money = value => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  const customField = (id, label, type, value) => {
    const wrapper = document.createElement('label')
    wrapper.className = 'field'
    const caption = document.createElement('span')
    caption.textContent = label
    const input = document.createElement('input')
    input.id = id
    input.type = type
    input.value = value
    wrapper.append(caption, input)
    return { wrapper, input }
  }

  const { wrapper: rateField, input: rateInput } = customField(
    'account-rate',
    'Rate per account / month (₹)',
    'number',
    '4000',
  )
  rateInput.min = '0.01'
  rateInput.step = '0.01'
  rateInput.required = true
  accountCountInput.closest('.field').after(rateField)

  const gstToggle = document.createElement('label')
  gstToggle.className = 'check gst-toggle'
  const gstInput = document.createElement('input')
  gstInput.id = 'include-gst'
  gstInput.type = 'checkbox'
  gstInput.checked = true
  const gstLabel = document.createElement('span')
  gstLabel.textContent = 'Include GST (18%)'
  gstToggle.append(gstInput, gstLabel)
  rateField.after(gstToggle)

  const messageSelectField = document.createElement('label')
  messageSelectField.className = 'field'
  const messageSelectLabel = document.createElement('span')
  messageSelectLabel.textContent = 'Choose a personal note (optional)'
  const messageSelect = document.createElement('select')
  messageSelect.id = 'message-preset'
  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.textContent = 'Select a message'
  messageSelect.append(defaultOption)
  presets.forEach((preset, index) => {
    const option = document.createElement('option')
    option.value = String(index)
    option.textContent = preset
    messageSelect.append(option)
  })
  messageSelectField.append(messageSelectLabel, messageSelect)
  customMessageInput.closest('.field').before(messageSelectField)

  const emailField = clientEmailInput.closest('.field')
  clientEmailInput.type = 'email'
  clientEmailInput.autocomplete = 'email'
  clientEmailInput.setAttribute('aria-describedby', 'email-validation')
  const emailError = document.createElement('span')
  emailError.id = 'email-validation'
  emailError.className = 'validation-error'
  emailError.setAttribute('aria-live', 'polite')
  emailField.append(emailError)

  const controlStyles = document.createElement('style')
  controlStyles.textContent = '.field select{display:block;width:100%;border:1px solid #3d536d;border-radius:8px;background:#1b344f;color:#fff;padding:10px 11px;outline:none;font-size:13px}.field select:focus{border-color:#9c80ff;box-shadow:0 0 0 3px #8c62ff26}.gst-toggle{margin:0 0 12px}.gst-toggle>span{font-size:12px}.validation-error{display:none;margin-top:6px;color:#ffaaa9;font-size:11px;line-height:1.4}.validation-error[data-visible="true"]{display:block}@media print{.paper .page-content{transform-origin:top left}}'
  document.head.append(controlStyles)

  const isEmailValid = () => {
    const value = clientEmailInput.value.trim()
    return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const updateEmailValidation = () => {
    const valid = isEmailValid()
    emailError.textContent = valid ? '' : 'Enter a valid email address or leave this field empty.'
    emailError.dataset.visible = String(!valid)
    clientEmailInput.setAttribute('aria-invalid', String(!valid))
    return valid
  }

  const renderProposal = () => {
    originalRender()
    window.activateProposalLinks()

    const count = Math.max(1, Math.min(1000, Math.floor(Number(accountCountInput.value) || 1)))
    const rate = Number(rateInput.value)
    const validRate = rateInput.checkValidity() && Number.isFinite(rate)
    const base = validRate ? count * rate : 0
    const tax = gstInput.checked ? base * 0.18 : 0
    const total = base + tax
    const gstRow = document.querySelector('.paper-3 .price-table tbody tr:nth-child(2)')
    const baseRow = document.querySelector('.paper-3 .price-table tbody tr:first-child')
    const totalRow = document.querySelector('.paper-3 .price-table tbody tr.total')

    document.querySelectorAll('.paper-1 .cover-band .price, .paper-3 .cover-band .price')
      .forEach(price => {
        const unit = price.querySelector('small')
        price.replaceChildren(document.createTextNode(money(validRate ? rate : 4000)), unit)
      })

    document.querySelector('.paper-1 .cover-band .tax').textContent = gstInput.checked
      ? '18% GST included in the total payable · No separate management fee for individual core services'
      : 'GST excluded from the total payable · No separate management fee for individual core services'
    document.querySelector('.paper-3 .cover-band .tax').textContent = gstInput.checked
      ? '18% GST included in total'
      : 'GST excluded from total'

    baseRow.children[0].textContent = `Seller account management (${count} × ${money(validRate ? rate : 4000)})`
    baseRow.children[1].textContent = money(base)
    gstRow.hidden = !gstInput.checked
    gstRow.children[0].textContent = 'GST @ 18%'
    gstRow.children[1].textContent = money(tax)
    totalRow.children[1].textContent = money(total)

    const pricingNote = document.querySelector('.paper-4 .page-content > .smallprint:last-child')
    pricingNote.textContent = `Prepared on ${document.getElementById('date').value ? new Date(`${document.getElementById('date').value}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}. Offer valid until ${document.getElementById('valid').value ? new Date(`${document.getElementById('valid').value}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}. Pricing: ${money(validRate ? rate : 4000)} per account per month ${gstInput.checked ? 'plus GST' : 'excluding GST'}.`

    updateEmailValidation()
  }

  const validateForPrint = () => {
    const emailValid = updateEmailValidation()
    const rateValid = rateInput.checkValidity()
    if (!rateValid) rateInput.reportValidity()
    if (!emailValid) {
      clientEmailInput.focus()
      clientEmailInput.reportValidity()
    }
    return emailValid && rateValid
  }

  const nativePrint = window.print.bind(window)
  window.print = () => {
    if (!validateForPrint()) return
    window.dispatchEvent(new Event('beforeprint'))
    nativePrint()
  }

  document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', renderProposal)
  })
  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', renderProposal)
  })
  messageSelect.addEventListener('change', () => {
    const index = Number(messageSelect.value)
    customMessageInput.value = messageSelect.value === '' ? '' : presets[index]
    renderProposal()
  })
  customMessageInput.addEventListener('input', () => {
    messageSelect.value = ''
  })
  clientEmailInput.addEventListener('blur', updateEmailValidation)
  resetButton.addEventListener('click', () => {
    rateInput.value = '4000'
    gstInput.checked = true
    messageSelect.value = ''
    updateEmailValidation()
    renderProposal()
  })

  window.render = renderProposal
  renderProposal()
})()
