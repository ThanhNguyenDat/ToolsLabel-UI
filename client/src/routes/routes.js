import config from '~/config';

// Layouts
import { HeaderOnly } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import Search from '~/pages/Search';
import Benchmark from '~/pages/Benchmark';
import Label from '~/pages/Label';
import History from '~/pages/History/History';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.search, component: Search, layout: null },

    // Label task
    { path: config.routes.label, component: Label },

    // Benchmark
    { path: config.routes.benchmark, component: Benchmark },
    { path: config.routes.history, component: History}
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
