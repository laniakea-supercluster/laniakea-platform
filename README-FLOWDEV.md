<style>
  body {
    font-family: 'Nexa', 'Arial', sans-serif;    
  }
</style>

# Development Flow

This section describes the development flow of the project, outlining the various components involved in the architecture and their interactions.

## <span style="color:#FF0000;">PAY ATTENTION: BEFORE BEGIN</span> 
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>


## 0. Initial Alternative
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## 1. Domain
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## 2. Hexagon
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">

### <span style="color:#00FF00">Domain</span> 

- [class] &rarr; Define Business Domain Classes

### <span style="color:#0099FF;">Application</span> 

1. **Usecases**
   - [interface] &rarr; [PrefixName]UseCases [Services Implements UseCase(s)] - [DI - &darr;Adapter]

2. **Ports** 
   - [interface] &rarr; [PrefixNameIn/Out]Port (Adapter implements Port) - [DI - &darr;Controller]

3. **Services**
   - [class] &rarr; [PrefixName]Service
   - Implements &uarr;UseCase
   - DI/IoC &darr;PortsOut
   - DI/IoC &darr;Domain

### <span style="color:#FFA500">Adapters</span> 

1. **Ports** 
   - [interface] &rarr; [PrefixNameIn/Out]Port (Adapter implements Port) - [DI - &darr;Controller]



</div>

## Framework
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Api
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Common
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Config
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Exceptions
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

<br/>
<br/>

# NestJS - [Put logo]

## Modules
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>

## Security
<div style="background-color: #333333; padding: 10px; border-radius: 5px;">
</div>