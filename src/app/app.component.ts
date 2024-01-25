import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currency = "$";

  form = this.fb.group({
    order: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required],
  });

  productsData: any;

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  ngOnInit() {
    this.appService.getData().subscribe((data) => (this.productsData = data));
  }

  // При клике на кнопку Смотреть меню перекидывает плавно на меню.
  // Дополнительно в HTML кодах main-action-button и products создан click со ссылками друг на друга
  scrollTo(target: HTMLElement, burger?: any) {
    target.scrollIntoView({behavior: "smooth"});
    if (burger) {
      this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
    }
  }

  // При клике на ссылки в хедере перекидывает плавно в нужной блок (скроллинг)
  // в HTML кодах "menu-item" к ссылке data-link удалены и созданы click со ссылками на обьекты. в тех обьектах создаем название такое же название через #

  // При клике на кнопку Заказать перекидыввет в раздел заказа
  // Тоже самое

  // Проверка (валидация) заполнил ли все поля клиент в заказе
  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value)
        .subscribe(
          {
            next: (response: any) => {
              alert(response.message);
              this.form.reset();
            },
            error: (response) => {
              alert(response.error.message);
            },
          }
        );
    }
  }

  // Чтобы подсвечивались в форме инпуты незаполненные, то в каждой заполняем пример [class]="{'error': form.get('order')?.invalid && (form.get('order')?.dirty || form.get('order')?.touched) }"
  // Чтобы кнопка была неактивна при незаполненных полях в форме, то в кнопке указываем [disabled]="!form.valid" и в стилях кнопки заполняем .button:disabled {
  //   cursor: not-allowed;
  //   color: gray;
  //   background: #343434;
  // }

  //Изменение курсов валют в меню при нажатии на кнопку в футере
  changeCurrency() {
    let newCurrency = "$";
    let coefficient = 1;

    if (this.currency === "$") {
      newCurrency = "₽";
      coefficient = 80;
    } else if (this.currency === "₽") {
      newCurrency = "BYN";
      coefficient = 3;
    } else if (this.currency === 'BYN') {
      newCurrency = '€';
      coefficient = 0.9;
    } else if (this.currency === '€') {
      newCurrency = '¥';
      coefficient = 6.9;
    }

    this.currency = newCurrency;

    this.productsData.forEach((item: any) => {
      item.price = +(item.basePrice + coefficient).toFixed(1);
    })
  }
}


