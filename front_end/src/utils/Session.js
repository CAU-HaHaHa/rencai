const LOGIN_COOKIE_NAME = 'sessionId'

export function isAuthenticated () {
  return _getCookie(LOGIN_COOKIE_NAME)
}

export function authenticateSuccess (token1, token2, token3) {
  _setCookie(LOGIN_COOKIE_NAME, token1, token2, token3)
}

export function logout () {
  _setCookie(LOGIN_COOKIE_NAME, '', '', '', 0)
}

export function getCookie(){
  let start, end, data;
  start = document.cookie.indexOf(LOGIN_COOKIE_NAME+'=')
  if (start !== -1) {
      start = start + 10;
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
          end = document.cookie.length
      }
      data = unescape(document.cookie.substring(start, end));
      console.log(data);
  }
  return data.split(',');
}


function _getCookie (name) {
  let start, end
  if (document.cookie.length > 0) {
    start = document.cookie.indexOf(name + '=')
    if (start !== -1) {
      start = start + name.length + 1
      end = document.cookie.indexOf(';', start)
      if (end === -1) {
        end = document.cookie.length
      }

      return unescape(document.cookie.substring(start, end));
    }
  }
  return ''
}

function _setCookie (name, user, pwd, utype, expire) {
  let date = new Date()
  date.setDate(date.getDate() + expire)

  if(expire==0){
    document.cookie = name + '=' + escape(user) + '; path=/' +
      (expire ? ';expires=' + date.toGMTString() : '');
  }
  else{
    document.cookie = name + '=' + escape(user) +','+escape(pwd) + ',' +escape(utype) + '; path=/' +
      (expire ? ';expires=' + date.toGMTString() : '');
  }
}