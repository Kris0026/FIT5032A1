<template>
  <div class="container">
    <h2 class="mb-3">Interactive Tables</h2>

    
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Users</h5>
        <p class="text-muted">Search/Sort/Paginate. Try per-column filters in the footer.</p>

        <table id="usersTable" class="display nowrap" style="width:100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Goal</th>
              <th>Age</th>
              <th>Email</th>
            </tr>
          </thead>
          <tfoot>
           
            <tr>
              <th><input type="text" placeholder="Search ID" /></th>
              <th><input type="text" placeholder="Search Name" /></th>
              <th><input type="text" placeholder="Search Goal" /></th>
              <th><input type="text" placeholder="Search Age" /></th>
              <th><input type="text" placeholder="Search Email" /></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title">Workouts</h5>
        <p class="text-muted">Also supports per-column filtering and pagination.</p>

        <table id="workoutsTable" class="display nowrap" style="width:100%">
          <thead>
            <tr>
              <th>ID</th>
              <th>Plan</th>
              <th>Duration (min)</th>
              <th>Calories</th>
              <th>Intensity</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th><input type="text" placeholder="Search ID" /></th>
              <th><input type="text" placeholder="Search Plan" /></th>
              <th><input type="text" placeholder="Search Duration" /></th>
              <th><input type="text" placeholder="Search Calories" /></th>
              <th><input type="text" placeholder="Search Intensity" /></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import 'datatables.net-dt/css/dataTables.dataTables.css'   
import $ from 'jquery'
import 'datatables.net-dt' 


function makeUsers(n = 30) {
  const goals = ['Lose weight', 'Gain muscle', 'Improve stamina', 'Reduce stress']
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    goal: goals[i % goals.length],
    age: 20 + ((i * 3) % 30),
    email: `user${i + 1}@demo.com`
  }))
}
function makeWorkouts(n = 30) {
  const plans = ['Cardio', 'HIIT', 'Yoga', 'Strength']
  const intensities = ['Low', 'Medium', 'High']
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    plan: plans[i % plans.length],
    duration: 15 + ((i * 5) % 45),
    calories: 100 + ((i * 23) % 400),
    intensity: intensities[i % intensities.length]
  }))
}

let usersDT = null
let workoutsDT = null

onMounted(() => {
  // --- Users table ---
  usersDT = $('#usersTable').DataTable({
    data: makeUsers(36),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Goal', data: 'goal' },
      { title: 'Age', data: 'age' },
      { title: 'Email', data: 'email' }
    ],
    pageLength: 10,       
    lengthChange: false,   
    order: [[0, 'asc']],   
    responsive: true,
    initComplete: function () {
     
      this.api().columns().every(function () {
        const column = this
        $('input', column.footer()).on('keyup change clear', function () {
          const val = this.value
          if (column.search() !== val) column.search(val).draw()
        })
      })
    }
  })

  
  workoutsDT = $('#workoutsTable').DataTable({
    data: makeWorkouts(32),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Plan', data: 'plan' },
      { title: 'Duration (min)', data: 'duration' },
      { title: 'Calories', data: 'calories' },
      { title: 'Intensity', data: 'intensity' }
    ],
    pageLength: 10,
    lengthChange: false,
    order: [[0, 'asc']],
    responsive: true,
    initComplete: function () {
      this.api().columns().every(function () {
        const column = this
        $('input', column.footer()).on('keyup change clear', function () {
          const val = this.value
          if (column.search() !== val) column.search(val).draw()
        })
      })
    }
  })
})

onBeforeUnmount(() => {
  
  if (usersDT) { usersDT.destroy(); usersDT = null }
  if (workoutsDT) { workoutsDT.destroy(); workoutsDT = null }
})
</script>

<style scoped>

tfoot input {
  width: 100%;
  box-sizing: border-box;
  padding: .25rem .5rem;
  font-size: .9rem;
}
</style>
