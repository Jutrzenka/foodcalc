export interface Product {
    id: string; //nanoid(24)
    name: string; //64
    userId: string; //36
    energy?: number | null;
    fat?: number | null;
    protein?: number | null;
    carbohydrates?: number | null;
}