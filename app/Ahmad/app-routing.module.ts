import { NgModule } from "@angular/core";
import { PreloadAllModules, PreloadingStrategy, RouterModule, Routes } from "@angular/router";
import { FavouriteListComponent } from "./favourite-list/favourite-list.component";
import { RoomDetailsComponent2 } from "./favourite-list/favourite-page/room-details/room-details.component";
import { ListfavsComponent } from "./favourite-list/listfavs/listfavs.component";
import { RoomDetailsComponent3 } from "./owner-part/faciliy-list/faciliy-item/room-details/room-details.component";
import { FaciliyListComponent } from "./owner-part/faciliy-list/faciliy-list.component";
import { ListOwnerComponent } from "./owner-part/list-owner/list-owner.component";
import { RoomStartComponent } from "./room-details/room-start/room-start.component";
import { RoomDetailsComponentAmir } from "./room-list/room-item/room-details copy/room-detailsamir.component";
import { RoomDetailsComponent } from "./room-list/room-item/room-details/room-details.component";
import { SearchComponent } from "./search/search.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserDetailsComponent } from "./user-profile/userdetails/userdatails.component";

const appRoutes:Routes=[
    // { path:'',redirectTo:'/search',pathMatch:'full' },
    { path:'search',component:SearchComponent,children:[
        { path:'',component:RoomStartComponent },
        { path:':id',component:RoomDetailsComponent }
    ]},{ path:'favorite',component:ListfavsComponent,children:[
        { path:'',component:RoomStartComponent },
        { path:':id',component:RoomDetailsComponent2 }
    ]  },
    { path:'facilitylist',component:ListOwnerComponent,children:[
        { path:'',component:RoomStartComponent },
        { path:':id',component:RoomDetailsComponent3 }
    ]  },{
        path:'profile',component:UserProfileComponent
    },{
        path:'profile/:id',component:UserDetailsComponent
    },
    {
        path:'roomdetails',component:SearchComponent
    }, {
        path:'roomdetails/:id',component:RoomDetailsComponentAmir
    }
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
