const https = require('https');

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(`Method not allowed: ${req.method}`);
    return;
  }

  const notification = `${req.query.name || 'Someone'} rang the doorbell.`;
  const accessCode = "nmac.P69AHYMHOMRI3HKSWK7AKZABZA45OGQZN4YNTMM";

  if (!accessCode) {
    throw new Error('Did you forget to assign ALEXA_ACCESS_CODE?');
  }

  console.log(notification);
  const url = new URL('https://api.notifymyecho.com/v1/NotifyMe');
  url.searchParams.append('notification', notification);
  url.searchParams.append('accessCode', accessCode);

  https.get(url, ({ statusCode }) => {
    const location = [200, 201, 202].includes(statusCode)
      ? '/success.html'
      : '/failure.html';
    res.statusCode = 303;
    res.setHeader('Location', location);
    res.setHeader('Content-Type', 'text/html');
    res.end(`Redirecting to <a href="${location}">${location}</a>...`);
  });
}
