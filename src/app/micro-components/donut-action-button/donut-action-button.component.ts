import {Component, Input} from '@angular/core';
import {ActionsBilling} from "../../github-api/actions-billing.model";
import {Organisation} from "../../github-api/organisation.model";
import {Utils} from "../../utils";
import {ThemeService} from "../../theme.service";
import Chart from "chart.js/auto";

@Component({
  selector: 'app-donut-action-button',
  templateUrl: './donut-action-button.component.html',
  styleUrls: ['./donut-action-button.component.scss']
})
export class DonutActionButtonComponent {
  @Input() billing!: ActionsBilling;
  @Input() org!: Organisation;
  @Input() selected = false;

  uuid = Utils.randomUUID();
  element?: HTMLElement;

  constructor(private themeService: ThemeService) {
    this.themeService.theme.subscribe(theme => {
      if (this.element) {
        this.buildChart(theme);
      }
    });
  }

  ngAfterViewInit() {
    this.element = document.getElementById(this.uuid) || undefined;
    this.buildChart(this.themeService.theme.value);
  }

  private buildChart(theme: string) {
    this.billing.minutesUsedBreakdown['available'] = this.billing.includedMinutes - this.billing.totalMinutesUsed;
    delete this.billing.minutesUsedBreakdown['total'];

    const labels = Object.keys(this.billing.minutesUsedBreakdown);
    const data = Object.values(this.billing.minutesUsedBreakdown) as number[];
    const config = this.getConfig(labels, data, theme);
    // @ts-ignore
    new Chart(this.element, config);
  }

  private getConfig(labels: string[], data: number[], theme: string) {
    return {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          borderColor: 'transparent',
          backgroundColor: this.getColors(data.length, theme),
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    };
  }

  private getColors(i: number, theme: string) {
    const colorPalette = ["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7", "#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"];
    const colors = colorPalette.slice(0, i - 1);
    theme === "light" ? colors.push('#22202120') : colors.push('#D3D3D320');
    return colors;
  }
}
