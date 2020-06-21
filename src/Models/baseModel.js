import Backbone from 'backbone';

export default class BaseModel extends Backbone.Model {

    parse(response) {
        if (response.data) {
            return response.data;
        }
        return response;
    }

}
