import useLibStore from "@/hooks/store/lib";
import { useSearchParams, useNavigate } from "react-router";

export const useBookSearch = () => {
    const [searchParams] = useSearchParams();
    const { chosenLibs } = useLibStore();
    const navigate = useNavigate();
    
    const url = new URL(window.location.href);
    const handleRedirect = (keyword: string) => {
        url.searchParams.set("q", keyword);
        url.searchParams.set("libCode", chosenLibs.map((v) => v.libCode).join());
        navigate(url.search, { replace: true });
    };
    const removeUrl = () => {
        navigate("", { replace: true });
    };
    return { handleRedirect, removeUrl, searchParams };
};