/** @type {import('next').NextConfig} */
const nextConfig = {
    // Next.js 16 SOP: PPR is now a top-level config called cacheComponents
    cacheComponents: true,
    allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.29.29'],
}

module.exports = nextConfig