import * as mongoUtil from '../utils/mongoUtil';

export const getUserInfo = async (query: { displayName: string | undefined }): Promise<Array<any>> => {
    let db = mongoUtil.getDB();
    return await db.collection('users').find(query).toArray();
}