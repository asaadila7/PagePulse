async function translate(text: string, from_code: string, to_code: string) {
  const original_text = text.replace(/\s+/g, '+')

  const url = `http://127.0.0.1:5000?q=${original_text}&source=${from_code}&target=${to_code}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (res.ok) {
    // Parse the JSON response and extract the translated text
    const data = await res.json()
    const translatedText = data.translation

    // Return the translated text
    return translatedText
  } else {
    // Handle the case where the response is not successful
    throw new Error(`Translation failed with status ${res.status}`)
  }
}

async function get_languages(from_code: string) {
  const url = `http://127.0.0.1:5000?languages=True&source=${from_code}`

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (res.ok) {
    // Parse the JSON response and extract the translated text
    const data = await res.json()
    const languages = data.languages

    // Return the translated text
    return languages
  } else {
    // Handle the case where the response is not successful
    throw new Error(
      `Was not able to retrieve available languages: ${res.status}`,
    )
  }
}

export { translate, get_languages }
