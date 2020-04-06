import pluginConfig from './config'

/**
 * Console log depending on config debug mode
 * @param {...*} message
 */
export const logDebug = function (message) {
  if (pluginConfig.debug) {
    console.log('VueGtm :', ...arguments)
  }
}

/**
 * Load GTM script tag
 * @param {String}  id  GTM ID
 */
export const loadScript = function (id) {
  const win    = window,
        doc    = document,
        script = doc.createElement('script'),
        dl     = 'dataLayer'

  win[dl] = win[dl] || []

  win[dl].push({
    event      :'gtm.js',
    'gtm.start': new Date().getTime(),
  })

  if (!id) {
    return
  }

  script.async = true;
  script.src   = `https://www.googletagmanager.com/gtm.js?id=${id}`

  doc.body.appendChild(script)
}
/**
 * Return censored path from router
 */
export const censorPath = function (route) {
	const url = new URL(window.location.href);
	const searchParams = new URLSearchParams(url.search);

	const censoredSearchParams = ['email', 'username', 'token', 'kco', 'phone'];

	for (const name of censoredSearchParams) {
		if (searchParams.has(name)) {
			searchParams.set(name, 'CENSORED');
		}
	}

	url.search = searchParams.toString();

	let urlString = url.toString();
	let path = route.path;

	const censoredParams = {
		'checkout-complete': ['id'],
		'order': ['id'],
		'swishPayment': ['orderId'],
	}[route.name]; // Plocka ut den vi är på direkt

	if (censoredParams) {
		for (const name of censoredParams) {
			if (route.params[name]) {
				// Censurera parametern både i location och page-värdena
				urlString = urlString.replace(route.params[name], 'CENSORED');
				path = path.replace(route.params[name], 'CENSORED');
			}
		}
	}

	if (searchParams.toString()) {
		path += '?' + searchParams.toString();
	}
	return path;
  }


/**
 * Check if GTM script is in the document
 * @return {boolean}
 */
export const hasScript = function () {
  return Array
    .from(document.getElementsByTagName('script'))
    .some(script => script.src.includes('googletagmanager'))
}
