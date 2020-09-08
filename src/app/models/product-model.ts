export type ProductModel = {
    prod_id: string,
    prod_name: string,
    prod_desc: string,
    prod_img: string
    prod_feat: any,
    prod_dim: { w: number, x: number, y: number, z: number } | number,
    prod_type: 0 | 1,
    prod_price: number,
    prod_stock: number,
    prod_rating: number
};
