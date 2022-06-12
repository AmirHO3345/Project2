import { NgModule } from "@angular/core";
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from "@angular/router";
import { RoomStartComponent } from "./room-details/room-start/room-start.component";
import { RoomDetailsComponent } from "./room-list/room-item/room-details/room-details.component";
import { SearchComponent } from "./search/search.component";

const appRoutes:Routes=[
    // { path:'',redirectTo:'/search',pathMatch:'full' },
    { path:'search',component:SearchComponent,children:[
        { path:'',component:RoomStartComponent },
        { path:':id',component:RoomDetailsComponent }
    ] },
    //{ path:'room-detail',component:RoomStartComponent}

    // { path:'recipes',component:RecipesComponent,
    // canActivate:[AuthGuard],
    // children:[
    //     { path:'',component:RecipeStartComponent },
    //     { path:'new',component:RecipeEditComponent },
    //     { path:':id',component:RecipeDetailComponent,resolve:[RecipesResolverService]},
    //     { path:':id/edit',component:RecipeEditComponent,resolve:[RecipesResolverService] }
    // ] },
    // { path:'shopping-list',component:ShoppingListComponent },
    // { path:'auth',component:AuthComponent  }

];

@NgModule({
    imports:[RouterModule.forChild(appRoutes)],
    exports:[RouterModule]
})
export class AppRoutingModule{

}
