export default function Page() {
    const backendUrl = import.meta.env.VITE_BACKEND_API
    console.log(backendUrl)
    const staticImageUrl = new URL("static/img/1234.jpg",backendUrl)

    return <img src={staticImageUrl.toString()} />
}