// DndContext Collision Detection Performance Benchmark
// Copy and paste this entire code into Chrome DevTools console

(function () {
  'use strict';

  console.log('🚀 DndContext Collision Detection Benchmark Starting...\n');

  // Mock Droppable class for realistic testing
  class MockDroppable {
    constructor(id) {
      this.id = Symbol(id);
      this.element = document.createElement('div');
    }
  }

  // Create realistic test data for DndContext collision detection scenarios
  // Simulates: currentCollisions vs nextCollisions for a single draggable
  function createDndTestData(numDroppables, overlapPercent = 70) {
    const allDroppables = [];

    // Create droppable objects
    for (let i = 0; i < numDroppables; i++) {
      allDroppables.push(new MockDroppable(`droppable-${i}`));
    }

    // Simulate current collisions (typically small set, e.g., 5-20 items)
    const currentCollisionSize = Math.min(20, Math.floor(numDroppables * 0.02));
    const currentCollisions = new Map();
    for (let i = 0; i < currentCollisionSize; i++) {
      currentCollisions.set(allDroppables[i], { distance: i * 10 });
    }

    // Simulate next collisions with realistic overlap
    const nextCollisionSize = Math.min(25, Math.floor(numDroppables * 0.025));
    const overlapCount = Math.floor(currentCollisionSize * (overlapPercent / 100));
    const nextCollisions = new Map();

    // Add overlapping collisions
    for (let i = 0; i < overlapCount; i++) {
      nextCollisions.set(allDroppables[i], { distance: i * 10 + 5 });
    }

    // Add new collisions
    for (
      let i = currentCollisionSize;
      i < currentCollisionSize + (nextCollisionSize - overlapCount);
      i++
    ) {
      if (i < allDroppables.length) {
        nextCollisions.set(allDroppables[i], { distance: i * 10 });
      }
    }

    return { currentCollisions, nextCollisions, allDroppables };
  }

  // Scenario 1: Current DndContext approach using native Set methods
  function testCurrentSetApproach(currentCollisions, nextCollisions, iterations) {
    // Pre-allocate reusable arrays (instance variables in real implementation)
    const removedArray = new Set();
    const addedArray = new Set();
    const persistedArray = new Set();

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      // Clear arrays
      removedArray.clear();
      addedArray.clear();
      persistedArray.clear();

      // Convert Maps to arrays for processing
      const nextDroppableSet = new Set(currentCollisions.keys()); // For O(1) lookups
      const currentDroppableSet = new Set(currentCollisions.keys()); // For O(1) lookups

      // Single pass through current to find removed and persisted
      for (const droppable of currentDroppableSet) {
        if (nextDroppableSet.has(droppable)) {
          persistedArray.add(droppable);
        } else {
          removedArray.add(droppable);
        }
      }

      // Single pass through next to find added
      for (const droppable of nextDroppableSet) {
        if (!currentDroppableSet.has(droppable)) {
          addedArray.add(droppable);
        }
      }

      // Simulate event emission checks
      if (removedArray.size > 0) {
        // Would emit leave event
        removedArray.size;
      }
      if (addedArray.size > 0) {
        // Would emit enter event
        addedArray.size;
      }
      if (persistedArray.size > 0) {
        // Would emit over event
        persistedArray.size;
      }
    }

    const end = performance.now();
    return end - start;
  }

  // Scenario 2: Array-based approach with pre-allocated arrays
  function testArrayBasedApproach(currentCollisions, nextCollisions, iterations) {
    // Pre-allocate reusable arrays (instance variables in real implementation)
    const removedArray = [];
    const addedArray = [];
    const persistedArray = [];

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      // Clear arrays
      removedArray.length = 0;
      addedArray.length = 0;
      persistedArray.length = 0;

      // Convert Maps to arrays for processing
      const nextDroppableSet = new Set(currentCollisions.keys()); // For O(1) lookups
      const currentDroppableSet = new Set(currentCollisions.keys()); // For O(1) lookups

      // Single pass through current to find removed and persisted
      for (const droppable of currentDroppableSet) {
        if (nextDroppableSet.has(droppable)) {
          persistedArray.push(droppable);
        } else {
          removedArray.push(droppable);
        }
      }

      // Single pass through next to find added
      for (const droppable of nextDroppableSet) {
        if (!currentDroppableSet.has(droppable)) {
          addedArray.push(droppable);
        }
      }

      // Simulate event emission checks
      if (removedArray.length > 0) {
        // Would emit leave event
        removedArray.length;
      }
      if (addedArray.length > 0) {
        // Would emit enter event
        addedArray.length;
      }
      if (persistedArray.length > 0) {
        // Would emit over event
        persistedArray.length;
      }
    }

    const end = performance.now();
    return end - start;
  }

  // Scenario 3: Hybrid optimized approach - store arrays, create Sets only when needed
  function testHybridOptimizedApproach(currentCollisions, nextCollisions, iterations) {
    // Pre-allocate arrays for storage
    const removedArray = [];
    const addedArray = [];
    const persistedArray = [];

    // Pre-allocate temporary sets for reuse
    let tempCurrentSet = new Set();
    let tempNextSet = new Set();

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      // Clear arrays
      removedArray.length = 0;
      addedArray.length = 0;
      persistedArray.length = 0;

      // Clear and populate temp sets efficiently
      tempCurrentSet.clear();
      tempNextSet.clear();

      for (const droppable of currentCollisions.keys()) {
        tempCurrentSet.add(droppable);
      }
      for (const droppable of nextCollisions.keys()) {
        tempNextSet.add(droppable);
      }

      // Optimized single-pass algorithm
      for (const droppable of tempCurrentSet) {
        if (tempNextSet.has(droppable)) {
          persistedArray.push(droppable);
        } else {
          removedArray.push(droppable);
        }
      }

      for (const droppable of tempNextSet) {
        if (!tempCurrentSet.has(droppable)) {
          addedArray.push(droppable);
        }
      }

      // Only create Sets for event emission if needed (lazy creation)
      if (removedArray.length > 0) {
        const removedSet = new Set(removedArray);
        removedSet.size; // Would emit leave event
      }
      if (addedArray.length > 0) {
        const addedSet = new Set(addedArray);
        addedSet.size; // Would emit enter event
      }
      if (persistedArray.length > 0) {
        const persistedSet = new Set(persistedArray);
        persistedSet.size; // Would emit over event
      }
    }

    const end = performance.now();
    return end - start;
  }

  // Run benchmark for a specific DndContext scenario
  function runDndBenchmark(numDroppables, iterations = 10000) {
    console.log(
      `\n📊 Testing DndContext with ${numDroppables} droppables, ${iterations} iterations:`,
    );
    console.log('─'.repeat(70));

    const { currentCollisions, nextCollisions } = createDndTestData(numDroppables);

    console.log(
      `📋 Test Data: ${currentCollisions.size} current collisions, ${nextCollisions.size} next collisions`,
    );

    // Warm up
    console.log('🔥 Warming up...');
    testCurrentSetApproach(currentCollisions, nextCollisions, 100);

    console.log('⚡ Running benchmarks...');

    const results = {};

    // Test current DndContext approach (native Set methods)
    try {
      results.currentSetApproach = testCurrentSetApproach(
        currentCollisions,
        nextCollisions,
        iterations,
      );
      console.log(`Current Set Approach:     ${results.currentSetApproach.toFixed(2)}ms`);
    } catch (e) {
      console.log(`Current Set Approach:     ❌ Not supported (${e.message})`);
    }

    results.arrayBasedApproach = testArrayBasedApproach(
      currentCollisions,
      nextCollisions,
      iterations,
    );
    console.log(`Array-Based Approach:     ${results.arrayBasedApproach.toFixed(2)}ms`);

    results.hybridOptimized = testHybridOptimizedApproach(
      currentCollisions,
      nextCollisions,
      iterations,
    );
    console.log(`Hybrid Optimized:         ${results.hybridOptimized.toFixed(2)}ms`);

    // Find the fastest
    const fastest = Object.entries(results).reduce(
      (min, [name, time]) => (time < min.time ? { name, time } : min),
      { name: 'none', time: Infinity },
    );

    console.log(`\n🏆 Winner: ${fastest.name.toUpperCase()} (${fastest.time.toFixed(2)}ms)`);

    // Show relative performance
    console.log('\n📈 Relative Performance:');
    Object.entries(results).forEach(([name, time]) => {
      const ratio = (time / fastest.time).toFixed(2);
      const percentage = ((time / fastest.time - 1) * 100).toFixed(1);
      const indicator = ratio == 1.0 ? '🏆' : ratio < 1.5 ? '🥈' : ratio < 2 ? '🥉' : '📉';
      console.log(
        `   ${indicator} ${name}: ${ratio}x (${percentage > 0 ? '+' : ''}${percentage}%)`,
      );
    });

    return results;
  }

  // Main DndContext benchmark suite
  function runDndFullBenchmark() {
    console.log('🎯 DndContext Collision Detection Performance Benchmark');
    console.log('═'.repeat(70));
    console.log(`Browser: ${navigator.userAgent.split(')')[0]})`);
    console.log(`Platform: ${navigator.platform}`);
    console.log('');
    console.log('🎮 Scenario: 5 draggables, varying droppable counts');
    console.log('🔍 Focus: Collision detection optimization for real-world usage');
    console.log('');

    // Test sizes: 5 draggables with 100, 1000, 10000 droppables
    const droppableCounts = [100, 1000, 10000];
    const allResults = {};

    droppableCounts.forEach((count) => {
      allResults[count] = runDndBenchmark(count);
    });

    // Summary table
    console.log('\n\n📋 SUMMARY TABLE');
    console.log('═'.repeat(80));
    console.log('Droppables | Current Set | Array-Based | Hybrid Opt | Best Method');
    console.log('─'.repeat(80));

    droppableCounts.forEach((count) => {
      const r = allResults[count];
      const current = r.currentSetApproach
        ? r.currentSetApproach.toFixed(1).padStart(10)
        : '     N/A ';
      const array = r.arrayBasedApproach.toFixed(1).padStart(10);
      const hybrid = r.hybridOptimized.toFixed(1).padStart(9);

      // Find the best method
      const fastest = Object.entries(r).reduce(
        (min, [name, time]) => (time < min.time ? { name, time } : min),
        { name: 'none', time: Infinity },
      );
      const bestMethod = fastest.name.padStart(11);

      console.log(
        `${count.toString().padStart(10)} |${current} |${array} |${hybrid} |${bestMethod}`,
      );
    });

    console.log('\n💡 RECOMMENDATIONS:');
    console.log('═'.repeat(50));

    // Analyze results and provide recommendations
    droppableCounts.forEach((count) => {
      const r = allResults[count];
      const entries = Object.entries(r);
      const fastest = entries.reduce((min, [name, time]) =>
        time < min.time ? { name, time } : min,
      );
      const currentTime = r.currentSetApproach || 'N/A';

      if (fastest.name !== 'currentSetApproach' && currentTime !== 'N/A') {
        const improvement = (((currentTime - fastest.time) / currentTime) * 100).toFixed(1);
        console.log(
          `📊 ${count} droppables: Switch to ${fastest.name} for ${improvement}% performance gain`,
        );
      } else {
        console.log(`✅ ${count} droppables: Current approach is optimal`);
      }
    });

    console.log('\n✅ DndContext benchmark complete! Copy results for analysis.');

    return allResults;
  }

  // Export for console access
  window.dndPerformanceBenchmark = {
    runDndFullBenchmark,
    runDndBenchmark,
    createDndTestData,
    // Individual test methods for manual testing
    testCurrentSetApproach,
    testArrayBasedApproach,
    testHybridOptimizedApproach,
  };

  // Auto-run
  return runDndFullBenchmark();
})();

// Usage:
// Just paste this entire code into Chrome DevTools console and it will run automatically
// Or call: dndPerformanceBenchmark.runDndFullBenchmark()
// Or test specific droppable count: dndPerformanceBenchmark.runDndBenchmark(1000)
// Or test individual approaches: dndPerformanceBenchmark.testArrayBasedApproach(...)
