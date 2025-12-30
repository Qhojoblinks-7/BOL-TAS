import React, { useState } from 'react';
import { Progress } from './progress';
import { Button } from './button';

const BoysProgressCard = () => {
  const [filter, setFilter] = useState('all');

  const data = {
    all: { boys: 45, total: 100 },
    boys: { boys: 45, total: 45 },
    girls: { boys: 0, total: 55 },
  };

  const currentData = data[filter];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Sunday Attendance</h3>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            style={filter === 'all' ? { backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' } : {}}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'boys' ? 'default' : 'outline'}
            onClick={() => setFilter('boys')}
            style={filter === 'boys' ? { backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' } : {}}
          >
            Boys
          </Button>
          <Button
            size="sm"
            variant={filter === 'girls' ? 'default' : 'outline'}
            onClick={() => setFilter('girls')}
            style={filter === 'girls' ? { backgroundColor: 'hsl(186, 70%, 34%)', color: 'white', border: 'none' } : {}}
          >
            Girls
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Boys Present</span>
            <span>{currentData.boys}/{currentData.total}</span>
          </div>
          <Progress value={(currentData.boys / currentData.total) * 100} className="h-3" />
        </div>

        <div className="text-center">
          <p className="text-2xl font-bold">{currentData.boys}</p>
          <p className="text-sm text-muted-foreground">
            {filter === 'all' ? 'Boys out of total attendance' :
             filter === 'boys' ? 'Total boys present' :
             'No boys in girls filter'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoysProgressCard;