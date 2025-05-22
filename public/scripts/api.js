export async function api(path, opts = {}) {
    opts.headers ??= {};
    opts.headers.Authorization = `Bearer ${sessionStorage.idToken}`;
    const res = await fetch(`https://<your-ec2-ip>:3000${path}`, opts);
    return res.json();
  }
  