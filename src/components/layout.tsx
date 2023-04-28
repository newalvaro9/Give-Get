import Head from 'next/head'

//Main page /...
export default function Layout({ children, title }: { children: React.ReactNode, title?: string }) {
    return (
        <>
            <Head>
                <title>{title ? title : "Untitled"}</title>
                <meta name="description" content="" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
            </Head>

            <div className='container-center-page'>
                {children}
            </div>
        </>
    )
}