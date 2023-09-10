import {AfterViewInit, Component, Input} from '@angular/core';
import {Utils} from "../../../../utils";
import {ActionsBilling} from "../actions-billing.model";
import {Organisation} from "../organisation.model";
import {ContextService} from "../../../context.service";
import Chart from "chart.js/auto";

@Component({
  selector: 'app-usage-chart',
  templateUrl: './usage-chart.component.html',
  styleUrls: ['./usage-chart.component.scss']
})
export class UsageChartComponent implements AfterViewInit {

  @Input() billing!: ActionsBilling;
  @Input() org!: Organisation;

  uuid = Utils.randomUUID();
  element?: HTMLElement;

  constructor(private contextService: ContextService) {
    this.contextService.theme.subscribe(theme => {
      if (this.element) {
        this.buildChart(theme);
      }
    });
  }

  ngAfterViewInit() {
    this.element = document.getElementById(this.uuid) || undefined;
    this.buildChart(this.contextService.theme.value);
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
    const colorPalette = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'];
    const colors = colorPalette.slice(0, i - 1);
    theme === "light" ? colors.push('#22202120') : colors.push('#D3D3D320');
    return colors;
  }
}
