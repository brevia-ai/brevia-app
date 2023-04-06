<template>
    <div class="h-screen flex flex-col">
        <MainHeader :route="$route" class="w-full fixed z-10 bg-neutral-50 shadow" ></MainHeader>
        <div class="grow mt-20 p-6 w-full max-w-3xl mx-auto space-y-8 ">
            <NuxtPage />
        </div>

        <MainFooter />
    </div>
</template>
