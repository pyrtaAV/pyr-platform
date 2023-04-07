
export default (req, res, next) => {
    req.userRole === 'Admin' ? next() : res.status(401).json({message:'В доступе отказано.'})
}