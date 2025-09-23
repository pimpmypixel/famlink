<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class Pest extends Command
{
    protected $signature = 'test {--parallel : Run tests in parallel} {--coverage : Run with coverage}';
    protected $description = 'Run tests using Pest';

    public function handle()
    {
        $command = ['vendor/bin/pest'];

        if ($this->option('parallel')) {
            $command[] = '--parallel';
        }

        if ($this->option('coverage')) {
            $command[] = '--coverage';
        }

        $process = new Process($command);
        $process->setTty(Process::isTtySupported());
        $process->run(function ($type, $buffer) {
            echo $buffer;
        });

        return $process->getExitCode();
    }
}
