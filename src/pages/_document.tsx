import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <meta name="theme-color" content="#FFC93A" />
                <meta
                    name="description"
                    content="spark is a performance profiler for Minecraft clients, servers, and proxies."
                />
                <link
                    href="/assets/logo-inverted-512.png"
                    rel="shortcut icon"
                    sizes="512x512"
                    type="image/png"
                />
                <link
                    rel="apple-touch-icon"
                    href="/assets/logo-inverted-160.png"
                />
                <script
                    async
                    defer
                    data-domain="spark.lucko.me"
                    src="https://plausible.lucko.me/js/pl.js"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
