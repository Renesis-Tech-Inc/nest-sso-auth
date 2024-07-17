import _mongoose from 'mongoose';
// Various Hack
// _mongoose.set('useFindAndModify', false);
(_mongoose as any).Promise = global.Promise;

export const mongoose = _mongoose;
export default mongoose;
