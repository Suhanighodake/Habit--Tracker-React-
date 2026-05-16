import { parseISO } from "date-fns";
import {  useEffect, useState } from "react";

export function useLocalStoarge<T>(key: string, initialValue: T) {
    const [storeValue, setStoreValue] = useState<T>(() => {
        try {
        const item =localStorage.getItem(key)
        if (item == null) return initialValue

        return JSON.parse(item, dateRevivier )
        } catch {
            return initialValue
        }  
    })

    useEffect(() => {
        localStorage.setItem(key ,JSON.stringify(storeValue))
    }, [storeValue, key])

    return [storeValue, setStoreValue] as const
}

function dateRevivier(_key: string, value: unknown) {
    if (typeof value === "string" && /^\d{4}-\d{2}-d{2}T/.test(value)){
        return parseISO(value)
    }
    return value
}