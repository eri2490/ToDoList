import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// ストアの定義
const store = new Vuex.Store({
  state: {
    // タスクの初期化
    tasks: [
      {
        id: 1,
        name: 'Buy milk',
        labelIds: [1, 2],
        done: false
      },
      {
        id: 2,
        name: 'Buy the book for Vue.js',
        labelIds: [1, 3],
        done: true
      }
    ],

    // ラベルの初期ステート
    labels: [
      {
        id: 1,
        text: '買い物'
      },
      {
        id: 2,
        text: '食料'
      },
      {
        id: 3,
        text: '本'
      }
    ],

    // 次に追加するタスク、ラベルのID
    // 実際はサーバーで生成するなどだが、ここでは決め打ち
    nextTaskId: 3,
    nextLabelId: 4,

    // フィルタするラベルのID
    filter: null
  },

  getters: {
    // フィルタ後のタスクを返す
    filteredTasks (state) {
      // ラベルが選択されていなければそのままの一覧を返す
      if (!state.filter) {
        return state.tasks
      }
      // 選択されているラベルでフィルタリング
      return state.tasks.filter(task => {
        return task.labelIds.indexOf(state.filter) >= 0
      })
    }
  },
  
  mutations: {
    // Add Task
    addTask (state, { name, labelIds }) {
      state.tasks.push({
        id: state.nextTaskId,
        name,
        labelIds,
        done: false
      })

      // タスクに付与するIDの更新
      state.nextTaskId++
    },

    // State of Tasks
    toggleTaskStatus (state, { id }) {
      const filtered = state.tasks.filter(task => {
        return task.id === id
      })

      filtered.forEach(task => {
        task.done = !task.done
      })
    },

    // Add Label
    addLabel (state, { text }) {
      state.labels.push({
        id: state.nextLabelId,
        text
      })

      // ラベルに付与するIDの更新
      state.nextLabelId++
    },

    // フィルタリング対象のラベルを変更
    changeFilter (state, { filter }) {
      state.filter = filter
    },
  },
})

// ストアをエクスポート
export default store