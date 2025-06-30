import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll';
import { Poll } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './poll.html',
  styleUrl: './poll.css'
})
export class PollComponent implements OnInit{
  newPoll: Poll ={
    id:0,
    question:'',
    options:[
      {optionText: '', voteCount:0},
      {optionText: '', voteCount:0}
    ]
  };
  polls:Poll[]=[];
  constructor(private pollservice:PollService){

  }

  ngOnInit(): void {
      this.loadPolls();
  }

  loadPolls(){
    this.pollservice.getPolls().subscribe({
      next:(data)=>{
        this.polls=data;
      },
      error:(error)=>{
        console.error("Error fetching polls: ",error);
      }
    });
  }

  addOption(){
    this.newPoll.options.push({optionText: '', voteCount:0})
  }

  createPoll(){
    this.pollservice.createPoll(this.newPoll).subscribe({
      next: (createPoll)=>{
        this.polls.push(createPoll);
        this.resetPoll();
      },
      error:(error)=>{
        console.error("Error creating polls: ",error);
      }
    });
  }

  resetPoll(){
    this.newPoll={
    id:0,
    question:'',
    options:[
      {optionText: '', voteCount:0},
      {optionText: '', voteCount:0}
    ]
  };
  }

  vote(pollId:number,optionIndex:number){
    this.pollservice.vote(pollId,optionIndex).subscribe({
       next: (createPoll)=>{
        const poll=this.polls.find(p=> p.id === pollId);
        if(poll){
          poll.options[optionIndex].voteCount++;
        }
      },
      error:(error)=>{
        console.error("Error voting on a poll: ",error);
      }
    });
  }

  trackByIndex(index:number) : number{
    return index;
  }
}
