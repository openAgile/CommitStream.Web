const catchAsyncErrors = fn => (req, res, next, ...rest) => {
    const routePromise = fn(req, res, next, ...rest);
    if (routePromise.catch) {
        routePromise.catch(err => {
            next(err)
        });
    }
};

export default catchAsyncErrors;