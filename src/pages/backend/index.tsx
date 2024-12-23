export default function Page() {
    const backendUrl = import.meta.env.VITE_BACKEND_API
    const staticImageUrl = new URL("static/img/1234.jpg",backendUrl)

    return <img src={staticImageUrl.toString()} />
    
}