export interface Recipe {
    id: string; //nanoid(24)
    name: string; //64
    userId: string; //36
    description?: string | null; //longtext 1024
}