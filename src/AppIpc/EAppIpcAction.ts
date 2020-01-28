export enum EAppIpcAction {
    // action not set.
    Unset = 'Unset',
    // query: fetch information
    Query = 'Query',
    // update: change remote's status
    Update = 'Update',
    // response: response for fetch(the fetched information) or change(ack)
    Response = 'Response'
}