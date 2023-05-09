import type { GetServerSidePropsContext } from "next";

export default function Index() {
    return <></>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        redirect: {
            destination: "/posts",
            permanent: false,
        },
    };
}