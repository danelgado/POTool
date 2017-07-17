import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {POComponent} from './components/po.component';

const appRoutes: Routes = [
    {
        path: 'po',
        component: POComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
