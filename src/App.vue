<template>
  <div class="task">
    <h2>タスク一覧</h2>
    <ul>
      <li v-for="task in tasks" v-bind:key="task.id">
        <input type="checkbox" v-bind:checked="task.done"
               v-on:change=toggleTaskStatus(task)>
        {{ task.name }}
        - 
        <span v-for="id in task.labelIds" v-bind:key="id">
          {{ getLabelText(id) }}
        </span>
      </li>
    </ul>

    <form v-on:submit.prevent="addTask">
      <input type="text" v-model="newTaskName" placeholder="新しいタスク">
    </form>

    <h2>ラベル一覧</h2>
    <ul>
      <li v-for="label in labels" v-bind:key="label.id">
        <input type="checkbox" v-bind:value="label.id" v-model="newTaskLabelIds">
        {{ label.text }}
      </li>
    </ul>

    <form v-on:submit.prevent="addLabel">
      <input type="text" v-model="newLabelText" placeholder="新しいラベル">
    </form>

    <h2>ラベルでフィルタ</h2>
    <ul>
      <li v-for="label in labels" v-bind:key="label.id">
        <input type="radio" v-bind:checked="label.id === filter"
               v-on:change="changeFilter(label.id)">
        {{ label.text }}
      </li>
      <li>
        <input type="radio" v-bind:checked="filter === null"
               v-on:change="changeFilter(null)">
        フィルタしない
      </li>
    </ul>

    <!-- <h2>保存と復元</h2>
    <button type="button" v-on:click="save">保存</button>
    <button type="button" v-on:click="restore">削除</button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 入力中の新しいタスク名を一時的に保持
      newTaskName: '',

      // 新しいタスクに紐づくラベル一覧を一時的に保持
      newTaskLabelIds: [],

      // 入力中の新しいラベルを一時的に保持
      newLabelText: ''
    }
  },

  computed: {
    tasks () {
      return this.$store.getters.filteredTasks  // タスクを読み込む
    },

    labels () {
      return this.$store.state.labels
    },

    filter () {
      return this.$store.state.filter
    }
  },

  methods: {
    // Add Task
    addTask() {
      this.$store.commit('addTask', {
        name: this.newTaskName,
        labelIds: this.newTaskLabelIds
      })
      this.newTaskName = ''
      this.newTaskLabelIds = []
    },

    // タスクの完了状態を更新
    toggleTaskStatus (task) {
      this.$store.commit('toggleTaskStatus', {
        id: task.id
      })
    },

    // ラベルの追加
    addLabel () {
      this.$store.commit('addLabel', {
        text: this.newLabelText
      })
      this.newLabelText = ''
    },

    // ラベルのIDから、そのラベルのテキストを返す
    getLabelText (id) {
      const label = this.labels.filter(label => label.id === id)[0]
      return label ? label.text : ''
    },

    // フィルタする対象のラベルを変更する
    changeFilter (labelId) {
      this.$store.commit('changeFilter', {
        filter: labelId
      })
    },

    // ステートを復元
    restore (state, { tasks, labels, nextTaskId, nextLabelId }) {
      state.tasks = tasks,
      state.labels = labels,
      state.nextTaskId = nextTaskId,
      state.nextLabelId = nextLabelId
    }
  },

  actions: {
    // ローカルストレージにステートを保存
    save ({ state }) {
      const data = {
        tasks: state.tasks,
        labels: state.labels,
        nextTaskId: state.nextTaskId,
        nextLabelId: state.nextLabelId
      }
      localStorage.setItem('task-app-data', JSON.stringify(data))
    },

    // ローカルストレージからステートを復元
    restore ({ commit }) {
      const data = localStorage.getItem('task-app-data')
      if (data) {
        commit('restore', JSON.parse(data))
      }
    }
  } 
}
</script>

<style>
.task{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  width: 60%;
  margin: 0 auto;
}

h2 {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #b8811c;
  margin-top: 60px;
}

ul{
  list-style: none;
}

li{
  font-size: 21px;
  color: #2c3e50;
}

form {
  padding-left: 40px;
}

form input{
  width: 220px;
  height: 22px;
  font-size: 15px;
}
</style>
