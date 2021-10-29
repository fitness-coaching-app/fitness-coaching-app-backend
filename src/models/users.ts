import * as mongoUtil from '../utils/mongoUtil';

export const getUserInfo = async (query: object): Promise<Array<any>> => {
    let db = mongoUtil.getDB();
    return await db.collection('users').find(query).toArray();
}