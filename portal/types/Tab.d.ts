import { Order } from "./Order"

export type Tab = {
    opened_at: number,
    closed: boolean
    orders: {
        for_user: {
            first_name: string,
            last_name: string,
            slack_user_id: string
        },
        item_name: string,
        item_price: number
    }[],
}