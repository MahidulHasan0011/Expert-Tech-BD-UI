import { Component, OnInit } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../interfaces/product';
import {ReloadService} from '../../services/reload.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

  // compareList: Product[] = []
  compareList: string[] = []
  compareListFromDB: Product[] = []
  ids: any[] = []

  constructor(
    private productService: ProductService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: 'smooth'
    // });
    
    this.reloadService.refreshCompareList$.subscribe(() => {
      this.getCompareList();
      setTimeout(() => {
        this.getCompareListFromDB()
      }, 400);
      
    })

    this.getCompareList();
    setTimeout(() => {
      this.getCompareListFromDB()
    }, 400);

  }

  getCompareList() {
    this.compareList = this.productService.getCompareList();
    console.log(this.compareList);
  }

  // getCompareListFromDB() {
  //   this.getCompareList();
  //   for(let i = 0; i < this.compareList.length; i++){
  //     this.slugs[i] = this.compareList[i].slug;
  //     this.productService.getProductBySlug(this.slugs[i])
  //       .subscribe( res => {
  //         this.compareListFromDB[i] = res.data;
  //       }, error => {
  //         console.log(error);
  //       });
  //   }
  //   console.log(this.compareListFromDB);
  // }

  getCompareListFromDB() {
    this.getCompareList();
    this.productService.getSpecificBooksById(this.compareList)
      .subscribe( res => {
        console.log(res);
        
        this.compareListFromDB = res.data;
      }, error => {
        console.log(error);
      });
    // for(let i = 0; i < this.compareList.length; i++){
    //   this.ids[i] = this.compareList[i];
    //   this.productService.getSingleProductById(this.ids[i])
    //     .subscribe( res => {
    //       console.log(res);
          
    //       this.compareListFromDB[i] = res.data;
    //     }, error => {
    //       console.log(error);
    //     });
    // }
    console.log(this.ids);
    console.log(this.compareListFromDB);
  }

  removeItem(id: string) {
    this.productService.deleteCompareItem(id);
    // location.reload();
    this.reloadService.needRefreshCompareList$();
  }
}
