<script setup lang="ts">
const { userMetrics, platformMetrics, isLoading } = useDashboard();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-sm font-medium text-muted mb-3">Suas Estatísticas</h3>
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-primary-100 rounded-xl p-3 flex flex-col items-center"
        >
          <SharedUiSkeletonText width="2rem" height="1.5rem" />
          <SharedUiSkeletonText width="4rem" height="0.75rem" class="mt-1" />
        </div>
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SharedUiMetricsCard
          label="Livros"
          :value="userMetrics?.totalBooks || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-accent-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </SharedUiMetricsCard>
        <SharedUiMetricsCard
          label="Publicados"
          :value="userMetrics?.publishedBooks || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </SharedUiMetricsCard>
        <SharedUiMetricsCard
          label="Rascunhos"
          :value="userMetrics?.drafts || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-warning"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </SharedUiMetricsCard>
        <SharedUiMetricsCard
          label="Leituras"
          :value="userMetrics?.totalReads || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-info"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </SharedUiMetricsCard>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-medium text-muted mb-3">Plataforma</h3>
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-primary-100 rounded-xl p-3 flex flex-col items-center"
        >
          <SharedUiSkeletonText width="2rem" height="1.5rem" />
          <SharedUiSkeletonText width="4rem" height="0.75rem" class="mt-1" />
        </div>
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <SharedUiMetricsCard
          label="Autores"
          :value="platformMetrics?.totalAuthors || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-accent-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </SharedUiMetricsCard>
        <SharedUiMetricsCard
          label="Livros"
          :value="platformMetrics?.totalBooks || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </SharedUiMetricsCard>
        <SharedUiMetricsCard
          label="Leitores"
          :value="platformMetrics?.totalReaders || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-warning"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </SharedUiMetricsCard>
        <SharedUiMetricsCard
          label="Palavras"
          :value="platformMetrics?.totalWords || 0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-info"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </SharedUiMetricsCard>
      </div>
    </div>
  </div>
</template>
