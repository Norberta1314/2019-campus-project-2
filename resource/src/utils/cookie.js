/* eslint-disable */
function decode(s) {
  return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
}

export const set = (k, v, attrs) => {
  if (typeof document === 'undefined') {
    return;
  }

  const attributes = {
    path: '/',
    ...attrs,
  };

  let key = k;
  let value = v;
  if (typeof attributes.expires === 'number') {
    attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
  }

  // We're using "expires" because "max-age" is not supported by IE
  attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

  try {
    var result = JSON.stringify(value);
    if (/^[\{\[]/.test(result)) {
      value = result;
    }
  } catch (e) {
  }

  value = encodeURIComponent(String(value))
    .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

  key = encodeURIComponent(String(key))
    .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
    .replace(/[\(\)]/g, escape);

  var stringifiedAttributes = '';
  for (var attributeName in attributes) {
    if (!attributes[attributeName]) {
      continue;
    }
    stringifiedAttributes += '; ' + attributeName;
    if (attributes[attributeName] === true) {
      continue;
    }

    // Considers RFC 6265 section 5.2:
    // ...
    // 3.  If the remaining unparsed-attributes contains a %x3B (";")
    //     character:
    // Consume the characters of the unparsed-attributes up to,
    // not including, the first %x3B (";") character.
    // ...
    stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
  }

  return (document.cookie = key + '=' + value + stringifiedAttributes);
};
export const get = (key, json) => {
  if (typeof document === 'undefined') {
    return;
  }
  var jar = {};
  // To prevent the for loop in the first place assign an empty array
  // in case there are no cookies at all.
  var cookies = document.cookie ? document.cookie.split('; ') : [];
  var i = 0;

  for (; i < cookies.length; i++) {
    var parts = cookies[i].split('=');
    var cookie = parts.slice(1).join('=');

    if (!json && cookie.charAt(0) === '"') {
      cookie = cookie.slice(1, -1);
    }

    try {
      var name = decode(parts[0]);
      cookie = decode(cookie);

      if (json) {
        try {
          cookie = JSON.parse(cookie);
        } catch (e) {
        }
      }

      jar[name] = cookie;

      if (key === name) {
        break;
      }
    } catch (e) {
    }
  }

  return key ? jar[key] : jar;
};
export const remove = (key, attributes) => {
  set(key, '', {
    ...attributes,
    expires: -1,
  });
};
