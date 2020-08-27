import Loadable from 'react-loadable';
import PageLoading from "./pageLoading";

export default function PageLoadable(opts) {
    return Loadable(Object.assign({loading: PageLoading}, opts));
}
