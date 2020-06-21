import Backbone from 'backbone';

export default class BaseCollection extends Backbone.Collection {

    parse(response) {
        if(response.data) {
            return response.data;
        }
        return response;
    }

    iwhere(key, val) {
        return this.filter((item) => {
            if (item.get(key)) {
                return item.get(key) === val;
            }
            return false;
        });
    }
}
