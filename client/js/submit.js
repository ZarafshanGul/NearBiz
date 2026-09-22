/* ============================================================
   SUBMIT PAGE — jQuery validation, POST to API, success state
   ============================================================ */

$(function () {

  const $form = $('#bizForm');
  const $submitBtn = $('#submitBtn');
  const $success = $('#formSuccess');
  const $banner = $('#submitBanner');

  const fields = ['businessName', 'ownerName', 'category', 'city', 'tagline', 'website', 'email'];

  function clearErrors() {
    fields.forEach(name => {
      $(`#${name}`).removeClass('is-invalid');
      $(`#err-${name}`).removeClass('is-shown').text('');
    });
  }

  function showError(name, message) {
    $(`#${name}`).addClass('is-invalid');
    $(`#err-${name}`).addClass('is-shown').text(message);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidWebsite(value) {
    if (!value) return true; // website is optional
    return /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(value.trim());
  }

  /* ---------------- Client-side validation ---------------- */
  function validate() {
    clearErrors();
    let valid = true;
    const data = {};

    fields.forEach(name => { data[name] = $(`#${name}`).val().trim(); });

    if (!data.businessName) { showError('businessName', 'Business name is required.'); valid = false; }
    if (!data.ownerName)    { showError('ownerName', 'Owner name is required.'); valid = false; }
    if (!data.category)     { showError('category', 'Please choose a category.'); valid = false; }
    if (!data.city)         { showError('city', 'City is required.'); valid = false; }
    if (!data.tagline)      { showError('tagline', 'A short tagline is required.'); valid = false; }

    if (!data.email) {
      showError('email', 'Email is required.'); valid = false;
    } else if (!isValidEmail(data.email)) {
      showError('email', 'Enter a valid email address.'); valid = false;
    }

    if (data.website && !isValidWebsite(data.website)) {
      showError('website', 'Enter a valid website, e.g. www.example.com'); valid = false;
    }

    return { valid, data };
  }

  /* ---------------- Map backend field errors ---------------- */
  function applyServerErrors(responseFields) {
    if (!responseFields) return;
    Object.keys(responseFields).forEach(name => {
      if (fields.includes(name)) {
        showError(name, responseFields[name]);
      }
    });
  }

  /* ---------------- Submit ---------------- */
  $form.on('submit', function (e) {
    e.preventDefault();

    const { valid, data } = validate();
    if (!valid) {
      const $firstError = $('.is-invalid').first();
      if ($firstError.length) {
        $('html, body').animate({ scrollTop: $firstError.offset().top - 140 }, 300);
      }
      return;
    }

    $submitBtn.prop('disabled', true).text('Submitting…');
    const bannerTimer = setTimeout(() => $banner.addClass('is-shown'), 1200);

    $.ajax({
      url: API.businesses,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      dataType: 'json',
      timeout: 45000
    })
      .done(function () {
        clearTimeout(bannerTimer);
        $banner.removeClass('is-shown');
        $submitBtn.prop('disabled', false).text('Add Your Business');
        $form.addClass('is-hidden');
        $success.addClass('is-shown');
        $form[0].reset();
        clearErrors();
      })
      .fail(function (xhr) {
        clearTimeout(bannerTimer);
        $banner.removeClass('is-shown');
        $submitBtn.prop('disabled', false).text('Add Your Business');

        if (xhr.status === 400 && xhr.responseJSON && xhr.responseJSON.fields) {
          applyServerErrors(xhr.responseJSON.fields);
          const $firstError = $('.is-invalid').first();
          if ($firstError.length) {
            $('html, body').animate({ scrollTop: $firstError.offset().top - 140 }, 300);
          }
        } else {
          showError('email', ''); // no-op, kept for symmetry
          alert('Something went wrong submitting your business. Please try again in a moment.');
        }
      });
  });

  /* ---------------- Live-clear error on input ---------------- */
  fields.forEach(name => {
    $(`#${name}`).on('input change', function () {
      $(this).removeClass('is-invalid');
      $(`#err-${name}`).removeClass('is-shown');
    });
  });
});
