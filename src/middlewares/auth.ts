import passport from "passport";

const ensureAuthenticated = passport.authenticate("jwt", { session: false });

export default ensureAuthenticated;
